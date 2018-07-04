const settings = {
  protocol: 'http',
  host: 'localhost',
  port: null,
  domain:'bms_api/src/api',
}
settings.url = `${settings.protocol}://${settings.host}${settings.port ? ':this.port'  : ''}/${settings.domain}`

export default settings