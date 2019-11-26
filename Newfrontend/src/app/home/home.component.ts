import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  webCam = false;
  allowCameraSwitch = true;
  public message: string;
  public camera: any;
  public storeImage;
  public showWebcam: any;
  public cameraButton: any;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public webcamImage: WebcamImage = null;
  public errors: WebcamInitError[] = null;
  count = 3;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    this.previewUrl = null;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {

      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.previewUrl);
    this.http.post('http://localhost:5000/uploadimage', formData)
      .subscribe(res => {
        console.log(res);
        console.log('data passed to backend')
        //this.count = res.count;
        //this.uploadedFilePath = res.data.filePath;
        alert('SUCCESS !!');
      })
  }
  onCamera() {
    this.webCam = true;
    this.previewUrl = null;;
  }
  toggleWebcam() {
    this.webCam = false;
  }
  public triggerSnapshot(): void {
    this.trigger.next();
    this.cameraButton = false;
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;

  }
  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.previewUrl = webcamImage.imageAsDataUrl;
    this.webCam = false;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public get nextWebcamObservable(): Observable<boolean | string> {


    var storeImage = this.nextWebcam.asObservable(); //this variable stores webcam image
    return this.nextWebcam.asObservable();

  }
}