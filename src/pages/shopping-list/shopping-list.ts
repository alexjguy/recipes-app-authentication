import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Ingredient} from "../../models/ingredient";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {

  listItems: Ingredient[];

  ionViewWillEnter(){
    this.listItems = this.sls.getItems();
  }


  constructor(private sls: ShoppingListService){}

  onAddItem(form: NgForm){
    this.sls.addItem(form.value.ingredientName, form.value.amount)
    form.reset();
    this.loadItems();

  }

  private loadItems(){
    this.listItems = this.sls.getItems();
  }

  onCheckItem(index: number){
    this.sls.removeItem(index);
    this.loadItems();
  }

}
