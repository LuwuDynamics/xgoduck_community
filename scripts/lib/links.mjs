import https from 'node:https';
import dns from 'node:dns/promises';
import net from 'node:net';
import { publicUrl } from './catalog.mjs';

const blocked = new net.BlockList();
for (const [ip, prefix] of [['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4]]) blocked.addSubnet(ip, prefix, 'ipv4');
blocked.addSubnet('2001:db8::', 32, 'ipv6');
const globalIPv6 = new net.BlockList();
globalIPv6.addSubnet('2000::', 3, 'ipv6');
export const isPublicIP = ip => net.isIP(ip) === 4 ? !blocked.check(ip, 'ipv4') : net.isIP(ip) === 6 && globalIPv6.check(ip, 'ipv6') && !blocked.check(ip, 'ipv6');
const addresses = new Map();
async function lookup(hostname) {
  if (!addresses.has(hostname)) addresses.set(hostname, dns.lookup(hostname, { all: true }).then(records => {
    if (!records.length || records.some(record => !isPublicIP(record.address))) throw new Error('链接解析到了非公开网络地址');
    return records;
  }));
  return addresses.get(hostname);
}
function request(url, method) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method, agent: false,
      headers: { 'User-Agent': 'XGO-Duck-Community-Link-Check/1.0', Accept: '*/*' },
      // Pin each request to validated DNS results, including every redirect.
      lookup: (hostname, options, callback) => lookup(hostname).then(records => {
        const matching = options.family ? records.filter(record => record.family === options.family) : records;
        if (!matching.length) return callback(new Error('没有可用的公开 IP 地址'));
        if (options.all) callback(null, matching);
        else callback(null, matching[0].address, matching[0].family);
      }, callback)
    }, response => {
      resolve({ status: response.statusCode, location: response.headers.location });
      response.destroy();
    });
    const timer = setTimeout(() => req.destroy(new Error('请求超时（12 秒）')), 12000);
    req.on('close', () => clearTimeout(timer));
    req.on('error', reject);
    req.end();
  });
}
export async function checkLink(input, { redirects = 0, method = 'HEAD' } = {}) {
  try {
    const url = publicUrl(input);
    const result = await request(url, method);
    if ([301, 302, 303, 307, 308].includes(result.status) && result.location) {
      if (redirects >= 5) return { state: 'warning', reason: '重定向超过 5 次' };
      return checkLink(new URL(result.location, url).href, { redirects: redirects + 1, method });
    }
    if ([405, 501].includes(result.status) && method === 'HEAD') return checkLink(input, { redirects, method: 'GET' });
    if ([404, 410].includes(result.status)) return { state: 'error', reason: `HTTP ${result.status}（链接不存在）` };
    if (result.status >= 200 && result.status < 300) return { state: 'ok', reason: `HTTP ${result.status}` };
    return { state: 'warning', reason: `HTTP ${result.status}（可能有访问限制，请人工复核）` };
  } catch (error) { return { state: 'warning', reason: error.message }; }
}
