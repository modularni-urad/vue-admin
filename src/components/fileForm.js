export const formCfg = [
  {
    "name":"file",
    "component":"dyn-fileinput",
    "label":"Soubor"
  }, {
    "name":"nazev",
    "component":"dyn-input",
    "fieldcomponent":true,
    "label":"Nazev",
    "rules":"required"
  },{
    "name":"tags",
    "component":"dyn-input",
    "label":"Tagy",
    "fieldcomponent":true,
    "rules":"required"
  },{
    "name":"popis",
    "component":"dyn-textarea",
    "label":"Popis"
  }
]

export async function prepareFileFormData(data) {
  if (!data.file) return data
  const content = await loadAsBase64(data.file)
  data.file = _.pick(data.file, 'type', 'name')
  data.file.content = content
  return data
}

function loadAsBase64(theFile) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()

    reader.onload = function(loadedEvent) {
        var arrayBuffer =  new Uint8Array(loadedEvent.target.result)
        const r = arrayBuffer.reduce((data, byte) => data + String.fromCharCode(byte), '') 
        resolve(btoa(r))
    }

    reader.readAsArrayBuffer(theFile)
  })
}