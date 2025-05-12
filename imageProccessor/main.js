    let inputImage = null;
    let outputImage = null;
    let outputImage1 = null;
    let outputImage2 = null;
    const canvasInput = document.getElementById('canvasInput');
    const canvasOutput = document.getElementById('canvasOutput');
    const canvasOutput1 = document.getElementById('canvasOutput1');
    const canvasOutput2 = document.getElementById('canvasOutput2');
    const ctxInput = canvasInput.getContext('2d');
    const ctxOutput = canvasOutput.getContext('2d');

    document.getElementById('uploadImage').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const img = new Image();
        img.onload = () => {
          canvasInput.width = img.width;
          canvasInput.height = img.height;
          canvasOutput.width = img.width;
          canvasOutput.height = img.height;
          canvasOutput1.width = img.width;
          canvasOutput1.height = img.height;
          canvasOutput2.width = img.width;
          canvasOutput2.height = img.height;
          ctxInput.drawImage(img, 0, 0);
          inputImage = cv.imread(canvasInput);
        };
        img.src = URL.createObjectURL(file);
      }
    });

    // Применение морфологической операции и фильтра резкости
    document.getElementById('applyMorphAndSharpness').addEventListener('click', () => {
      if (!inputImage) {
        alert('Сначала загрузите изображение!');
        return;
      }

      const operation = document.getElementById('morphOperation').value;
      const shape = document.getElementById('elementShape').value;
      const size = parseInt(document.getElementById('elementSize').value, 10);

      const kernelShape = {
        rect: cv.MORPH_RECT,
        ellipse: cv.MORPH_ELLIPSE,
        cross: cv.MORPH_CROSS
      }[shape];

      const kernel = cv.getStructuringElement(kernelShape, new cv.Size(size, size));
      outputImage = new cv.Mat();

      switch (operation) {
        case 'erode':
          cv.erode(inputImage, outputImage, kernel);
          break;
        case 'dilate':
          cv.dilate(inputImage, outputImage, kernel);
          break;
        case 'open':
          cv.morphologyEx(inputImage, outputImage, cv.MORPH_OPEN, kernel);
          break;
        case 'close':
          cv.morphologyEx(inputImage, outputImage, cv.MORPH_CLOSE, kernel);
          break;
      }
      cv.imshow(canvasOutput, outputImage);

      const sharpenKernel = cv.matFromArray(3, 3, cv.CV_32F, [
        0, -1,  0,
       -1,  5, -1,
        0, -1,  0
      ]);

      outputImage1 = new cv.Mat();
      cv.filter2D(inputImage, outputImage1, cv.CV_8U, sharpenKernel);
      cv.imshow(canvasOutput1, outputImage1);
      outputImage2 = new cv.Mat();
      cv.filter2D(outputImage, outputImage2, cv.CV_8U, sharpenKernel);
      cv.imshow(canvasOutput2, outputImage2);
      sharpenKernel.delete();
      outputImage.delete();
      outputImage1.delete();
      outputImage2.delete();
      kernel.delete();
    });

    window.addEventListener('unload', () => {
      if (inputImage) inputImage.delete();
    });