import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaViewComponent} from "./qna-view.component";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {Editor} from "primeng/editor";
import {GalleriaModule} from "primeng/galleria";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {SafeHtmlPipe} from "../../../../guards/safe-html.pipe";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {QnaViewRoutingModule} from "./qna-view-routing.module";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [QnaViewComponent],
  imports: [
    CommonModule, QnaViewRoutingModule, Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, Card, Editor, GalleriaModule, PrimeTemplate, ProgressSpinComponent, SafeHtmlPipe, Tag, Tooltip, TranslatePipe, FormsModule
  ]
})
export class QnaViewModule { }
