import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Livre } from 'src/app/models/Livre';
import { LivreWebServiceService } from 'src/app/webServices/Livre/livre-web-service.service';
import { CategorieWebServiceService } from 'src/app/webServices/categorie/categorie-web-service.service';
import { Categorie } from 'src/app/models/Categorie';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creation-livre',
  templateUrl: './creation-livre.page.html',
  styleUrls: ['./creation-livre.page.scss','./../../../app.component.scss'],
})
export class CreationLivrePage implements OnInit {

  form: FormGroup;
  actionType: string;
  idLivre?: any;
  titreLivre: string;
  resumerLivre: string;
  prixLivreHt: any;
  prixLivreTtc: any;
  stockInvLivre: any;
  stockCmdLivre: any;
  idEditeur: any;
  urlPhoto: string;
  categories$: Observable<Categorie[]>;
  postId: number;
  errorMessage: any;
  existingClientPost: Livre;
  
  constructor(private formBuilder: FormBuilder,
    private livreWebService: LivreWebServiceService,
    private categorieWebService: CategorieWebServiceService,
    private avRoute: ActivatedRoute, private router: Router ) { 
      const idParam = 'id';
      this.actionType = 'Add';
      this.titreLivre = 'titreLivre';
      this.resumerLivre = 'resumerLivre';
      this.prixLivreHt = '';
      this.prixLivreTtc = '';
      this.stockInvLivre = '';
      this.idEditeur = '';
      this.urlPhoto = 'urlPhoto';

      if (this.avRoute.snapshot.params[idParam]) {
        this.postId = this.avRoute.snapshot.params[idParam];
      }

      this.form = this.formBuilder.group(
        {
          postId: 0,
          titreLivre: ['', [Validators.required]],
          resumerLivre: ['', [Validators.required]],
          prixLivreHt: ['', [Validators.required]],
          prixLivreTtc: ['', [Validators.required]],
          stockInvLivre: ['', [Validators.required]],
          idEditeur: ['', [Validators.required]],
          urlPhoto: ['', [Validators.required]]
        }
      )
     }

     ngOnInit(){
      if(this.postId >= 0){
        this.actionType = 'Add';
        this.livreWebService.getLivretID(this.postId)
          .subscribe(data => (
            this.existingClientPost = data,
            this.form.controls[this.titreLivre].setValue(data.titreLivre),
            this.form.controls[this.resumerLivre].setValue(data.resumerLivre),
            this.form.controls[this.prixLivreHt].setValue(data.prixLivreHt),
            this.form.controls[this.prixLivreTtc].setValue(data.prixLivreTtc),
            this.form.controls[this.stockInvLivre].setValue(data.stockInvLivre),
            this.form.controls[this.idEditeur].setValue(data.idEditeur),
            this.form.controls[this.urlPhoto].setValue(data.urlPhoto)
          ));
      }
      this.loadCategorie();

     }

     loadCategorie() {
      this.categories$ = this.categorieWebService.getCategories();
    }

     save(){
       if(!this.form.valid){
         return ;
       }

       if (this.actionType === 'Add') {
        let livre: Livre = {
          titreLivre: this.form.get(this.titreLivre).value,
          resumerLivre: this.form.get(this.resumerLivre).value,
          prixLivreHt : this.form.value.prixLivreHt,
          prixLivreTtc: this.form.value.prixLivreTtc,
          stockInvLivre: this.form.value.stockInvLivre,
          idEditeur: this.form.value.idEditeur,       
          urlPhoto: this.form.get(this.urlPhoto).value
  
        };
  
        this.livreWebService.saveClient(livre)
          .subscribe((data) => {
            this.router.navigate(['/livres']);
          });
      }
     }

     /***
      * save() {
    if (!this.form.valid) {
      return;
    }

    
  }
      */


  }


