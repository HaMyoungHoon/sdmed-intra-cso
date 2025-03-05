import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {ExternalBlobViewComponent} from "./external-blob-view.component";


@NgModule({
  imports: [RouterModule.forChild([{path:"", component: ExternalBlobViewComponent}])],
  exports: [RouterModule]
})
export class ExternalBlobViewRoutingModule { }
