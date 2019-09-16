import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageDetailList: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) { }

  getImageDetails() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  insertImageDetails(details) {
    this.imageDetailList.push(details);
  }
}
