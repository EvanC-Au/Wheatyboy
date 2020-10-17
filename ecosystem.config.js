module.exports = {
  apps : [{
    name: 'wheatyboy',
    script: 'server.js',
    watch: true,
    watch_delay: 1000,
    ignore_watch : ["node_modules", "*.log"],
    out_file: 'flour.log',
    combine_logs: true
  }]
}
