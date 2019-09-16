import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ImageService } from '../../shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  formTemplate: FormGroup;
  imageSrc: string | SafeUrl;
  selectedImage: any;
  isSubmitted: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    private imgService: ImageService
    ) {
    this.formTemplate = new FormGroup({
      caption: new FormControl('', Validators.required),
      category: new FormControl(''),
      imageUrl: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.setDefaults();
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

  get formControls(): object {
    return this.formTemplate.controls;
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      const filePath = `${formValue.category}/${this.selectedImage.name}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage)
        .snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              formValue.imageUrl = url;
              this.imgService.insertImageDetails(formValue);
              this.resetForm();
            });
          })
        ).subscribe();
    }
  }

  resetForm(): void {
    this.formTemplate.reset({
      caption: '', category: 'Buildings', imageUrl: ''
    });
    this.setDefaults();
  }

  setDefaults(): void {
    this.imageSrc = '/assets/images/image_placeholder.png';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

}
