
function replaceConst (constsLeft, consts, settings) {
  if (constsLeft.length === 0) return settings
  const c = constsLeft.pop()
  const newSett = settings.replaceAll('${' + c + '}', consts[c])
  return replaceConst(constsLeft, consts, newSett)
}

export default async function loadSettings (url) {
  const req = await axios(url)
  const s = url.match(/.*yaml$/) ? jsyaml.load(req.data) : req.data
  const rawData = url.match(/.*yaml$/) ? req.data : jsyaml.dump(req.data)
  return s.consts && Object.keys(s.consts).length > 0
    ? jsyaml.load(replaceConst(Object.keys(s.consts), s.consts, rawData))
    : s
}