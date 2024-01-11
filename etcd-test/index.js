const { Etcd3 } = require('etcd3');
const client = new Etcd3({
    hosts: 'http://localhost:2379',
    auth: {
        username: 'root',
        password: 'guang'
    }
});

// config center
async function saveConfig(key, value) {
    await client.put(key).value(value);
}
async function getConfig(key) {
    const value = await client.get(key).string();
    return value;
}
async function deleteConfig(key) {
    await client.delete().key(key);
}
// (async function main() {
//     await saveConfig('config-key', 'config-value');
//     const configValue = await getConfig('config-key');
//     console.log('Config value:', configValue);
//     await deleteConfig('config-key');
// })();

// register center
// 服务注册
async function registerService(serviceName, instanceId, metadata) {
    const key = `/services/${serviceName}/${instanceId}`;
    const lease = client.lease(10);
    await lease.put(key).value(JSON.stringify(metadata));
    lease.on('lost', async () => {
        console.log('租约过期，重新注册...');
        await registerService(serviceName, instanceId, metadata);
    });
}

// 服务发现
async function discoverService(serviceName) {
    const instances = await client.getAll().prefix(`/services/${serviceName}`).strings();
    return Object.entries(instances).map(([key, value]) => JSON.parse(value));
}

async function watchService(serviceName, callback) {
    const watcher = await client.watch().prefix(`/services/${serviceName}`).create();
    watcher.on('put', async event => {
        console.log('服务实例新增:', event.key.toString(), event.value.toString());
        callback(await discoverService(serviceName));
    }).on('delete', async event => {
        console.log('服务实例删除:', event.key.toString(), event.value.toString());
        callback(await discoverService(serviceName));
    });
}
(async function main() {
    const serviceName = 'my_service';
    
    await registerService(serviceName, 'instance_1', { host: 'localhost', port:3000 });
    await registerService(serviceName, 'instance_2', { host: 'localhost', port:3002 });

    const instances = await discoverService(serviceName);
    console.log('所有服务节点:', instances);

    watchService(serviceName, updatedInstances => {
        console.log('服务节点有变动:', updatedInstances);
    });
})();
