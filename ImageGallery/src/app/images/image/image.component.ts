import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  formTemplate: FormGroup;
  imageSrc: string | SafeUrl;
  selectedImage: any;

  constructor(private sanitizer: DomSanitizer) {
    this.formTemplate = new FormGroup({
      caption: new FormControl(''),
      category: new FormControl(''),
      imageUrl: new FormControl('')
    });
    this.imageSrc = '/assets/images/image_placeholder.png';
    this.selectedImage = null;
  }

  ngOnInit() {
  }

  showPreview(event: any): void {
    if (event.target.files[0]) {
      this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.selectedImage = event.target.files[0];
    } else {
      this.imageSrc = '/assets/images/image_placeholder.png';
      this.selectedImage = null;
    }
  }

  onSubmit() {

  }

}
