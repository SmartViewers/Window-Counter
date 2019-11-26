import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  constructor(private http: HttpClient) { }

  url: any = 'http://localhost:5000';
  uploadImageEndPoint: any = '/uploadimage';

  imageUpload(image): any {
    const httpOptions = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'});

    console.log('image uploading');
    return this.http.post<any>(this.url + this.uploadImageEndPoint,  image,
         {headers: httpOptions, responseType: 'blob' as 'json' });
  }

}
