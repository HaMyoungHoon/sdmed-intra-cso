import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiViewComponent} from "./edi-view.component";
import {EdiViewRoutingModule} from "./edi-view-routing.module";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {FullscreenFileViewComponent} from "../../../common/fullscreen-file-view/fullscreen-file-view.component";
import {TranslatePipe} from "@ngx-translate/core";
import {GalleriaModule} from "primeng/galleria";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {Tag} from "primeng/tag";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Textarea} from "primeng/textarea";
import {Select} from "primeng/select";
import {IftaLabel} from "primeng/iftalabel";



@NgModule({
  declarations: [EdiViewComponent],
	imports: [
		CommonModule, EdiViewRoutingModule, Accordion, AccordionPanel, AccordionHeader, AccordionContent, ProgressSpinComponent, FullscreenFileViewComponent, TranslatePipe, GalleriaModule, Button, Tooltip, Tag, TableModule, FormsModule, InputText, Textarea, Select, IftaLabel
	]
})
export class EdiViewModule { }
