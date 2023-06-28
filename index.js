console.log("hi there..welcome to my imageResizer");
let radioClass = document.getElementsByClassName("radio");
let img = document.getElementById("file");
let formClass = document.getElementsByTagName("form");
const custom = document.getElementById("custom");
formClass[0].addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    if (!img.value) {
      throw new Error("No file was selected!");
    }
    if (img.files[0].type.split("/")[0] !== "image") {
      throw new Error("please select an image");
    }
    let radioValue;
    for (i of radioClass) {
      if (i.checked == true) {
        radioValue = i.value;
      }
    }
    console.log(radioValue);
    let downloadWindow = document.getElementById("downloadwindow");
    let dimensions = radioValue.split(",");

    getBase64EncodingOfImage(img.files[0]).then(async (base64) => {
      document.getElementById("msg").textContent = "please wait resizing";
      resizeImageFromBase64(base64, +dimensions[0], +dimensions[1])
        .then((e) => {
          let image = document.createElement("img");

          document.getElementById("msg").textContent =
            "resize completed successfully";
          downloadWindow.innerHTML = "please wait....";

          let dlink = document.createElement("a");
          dlink.className = "downloadLink";
          dlink.href = `${e}`;
          dlink.textContent = "IMAGE download link";
          dlink.download = "resizedBySolomon";

          setTimeout(() => {
            downloadWindow.innerHTML =
              "<p>completed please perform another task</p>";
            downloadWindow.append(dlink);
          }, 1000);
        })
        .catch((err) => {
          document.getElementById("msg").textContent = "error in resize";
        });
    });
  } catch (error) {
    alert(error.message);
  }
});

let customWindow = document.getElementById("customWindow");
async function customDimensions() {
  try {
    customWindow.innerHTML = "";
    let form = document.createElement("form");
    form.id = "customForm";
    let width = document.createElement("input");
    width.type = "number";
    let btn = document.createElement("button");
    let closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.id = "close";
    btn.textContent = "create custom dimension";
    width.placeholder = "enter width";
    let height = document.createElement("input");
    height.placeholder = "enter height";
    height.type = "number";
    form.append(closeButton, width);
    form.append(height);
    form.append(btn);
 
    customWindow.append(form);

    form.addEventListener("submit",async (e) => {
      e.preventDefault();

      if (!height.value || !width.value) {
        console.log(height.value, width.value);
        throw new Error("please fill in height and width");
      }

      let newDimensions = document.createElement("input");
      const label = document.createElement("label");
      let p = document.createElement("p");
      p.textContent = `${width.value}x ${height.value}`;
      label.append(p, newDimensions);

      newDimensions.type = "radio";
      newDimensions.name = "dimension";
      newDimensions.className = "radio";
      newDimensions.value = `${width.value},${height.value}`;
      document.getElementById("dimensionz").append(label);
      customWindow.innerHTML = "";
    });
    closeButton.addEventListener("click", () => {
      customWindow.innerHTML = "";
    });
  } catch (error) {
    
    alert(error.message);
  }
}

//functions
function getBase64EncodingOfImage(imgBlob) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(imgBlob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}

function resizeImageFromBase64(base64, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = document.createElement("img");
    img.src = base64;
    img.onload = () => {
      let scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.width * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL());
    };
  });
}
