document.addEventListener("DOMContentLoaded", () => {
    const videoContainer = document.getElementById("video-container");
    const webcam = document.getElementById("webcam");
    const captureButton = document.getElementById("capture-button");
    const captureRectangle = document.getElementById("capture-rectangle");
    const canvas = document.getElementById("canvas");
    const downloadLink = document.getElementById("download-link");
    const capturedImage = document.getElementById("captured-image");
    const transformedImage = document.getElementById("transformed-image");

    let stream;

    // 웹캠 스트림 가져오기
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((videoStream) => {
            stream = videoStream;
            webcam.srcObject = videoStream;
        })
        .catch((error) => {
            console.error("웹캠을 가져오는 중 오류 발생: " + error);
        });

    // "찍기" 버튼 클릭 시 사진 찍기
    captureButton.addEventListener("click", () => {
        takePicture();
    });


    function takePicture() {
        const context = canvas.getContext("2d");
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);

        // 이미지 다운로드 링크 설정
        // Canvas에서 Blob 객체 생성
        canvas.toBlob((blob) => {

            // Blob 객체 변환 실행
            transformImage(blob);

            // 변환된 이미지 파일로 저장
            const fileName = "transformed-image.jpeg";
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);

        }, "image/jpeg");


            // Canvas에서 이미지 데이터 URL 가져오기
            const imageDataURL = canvas.toDataURL("image/jpeg");

            // 이미지를 <img> 요소에 표시
            transformedImage.src = imageDataURL;
            transformedImage.style.display = "block";
    }

    // 창을 닫을 때 웹캠 스트림 해제
    window.addEventListener("beforeunload", () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    });

    async function transformImage(image) {
        // 모델 로드
        const model = await tf.loadLayersModel('dataset_infos.json');

        // 이미지를 텐서로 변환
        const inputTensor = tf.browser.fromPixels(image);
        const inputTensorNormalized = inputTensor.div(255.0).expandDims();

        // 모델에 입력 전달하여 이미지 변환
        const transformedTensor = model.execute(inputTensorNormalized);

        // 변환된 이미지를 픽셀 데이터로 변환
        const transformedData = await transformedTensor.data();

        // 변환된 이미지를 canvas에 그리기
        const context = canvas.getContext('2d');
        const [width, height] = [image.width, image.height];
        const transformedImageData = new ImageData(new Uint8ClampedArray(transformedData), width, height);

        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.putImageData(transformedImageData, 0, 0, canvas.width, canvas.height);
    }

    // 이미지 변환 실행
    const inputImageElement = document.getElementById('inputImage');
    inputImageElement.onload = () => {
        transformImage(inputImageElement);
    };
  
});