import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Ingredient} from "../../models/ingredient";
import {PopoverController, LoadingController, AlertController} from "ionic-angular";
import {DatabaseOptionsPage} from "../database-options/database-options";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})

export class ShoppingListPage {

  listItems: Ingredient[];

  ionViewWillEnter() {
    this.listItems = this.sls.getItems();
  }


  constructor(private sls: ShoppingListService,
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  onAddItem(form: NgForm) {
    this.sls.addItem(form.value.ingredientName, form.value.amount)
    form.reset();
    this.loadItems();

  }

  private loadItems() {
    this.listItems = this.sls.getItems();
  }

  onCheckItem(index: number) {
    this.sls.removeItem(index);
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if (!data) {
          return;
        }
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getToken()
            .then((token: string) => {
              this.sls.fetchList(token)
                .subscribe(
                  (list: Ingredient[]) => {
                    loading.dismiss();
                    if (list) {
                      this.listItems = list;
                    } else {
                      console.log('No save')
                    }
                  },
                  error => {
                    loading.dismiss();
                    this.handleError(error.json().error);
                  }
                )
            })
            .catch(error => {
              this.handleError(error.message);
            });
        } else if (data.action == 'store') {
          loading.present();
          this.authService.getActiveUser().getToken()
            .then((token: string) => {
              this.sls.storeList(token)
                .subscribe(
                  () => loading.dismiss(),
                  error => {
                    loading.dismiss();
                    this.handleError(error.json().error);
                  }
                )
            })
            .catch(error => {
              console.log(error.message);
            });

        }
      }
    )
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occured!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
