import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { ConfigComponent } from './config.component';

@NgModule({
    imports: [CommonModule],
    providers: [ConfigService],
    declarations: [ConfigComponent]
})
export class ConfigModule { }
