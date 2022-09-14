var qrcode = new QRCode("qrcode", {
  text: "https://www.linkedin.com/in/",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

function createQrCode(profile) {
  qrcode.clear();
  qrcode.makeCode(`https://www.linkedin.com/in/${profile}`);

  const imgEl = document.getElementsByTagName("img")[0];

  return imgEl.src;
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

function generate() {
  const profile = document.getElementById("profile").value;
  const imageData = createQrCode(profile).split(";");
  if (imageData.length < 2) return;

  const contentType = imageData[0];
  const base64 = imageData[1].substring(7);
  const imageBlob = b64toBlob(base64, contentType);

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            text: "Live Curriculum",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph(''),
          new docx.Paragraph({
            children: [
              new docx.ImageRun({
                data: imageBlob,
                transformation: {
                  width: 500,
                  height: 500,
                },
              }),
            ],
          }),
        ],
      },
    ],
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, `curriculo_${profile}.docx`);
    console.log("Document created successfully");
  });
}
