import { HttpClient } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { TranslateLoader, TranslateModule, TranslateModuleConfig } from "@ngx-translate/core";
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';

const HttpLoaderFactory = () => {
    return provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
};

const translateModuleConfig: TranslateModuleConfig = {
    defaultLanguage: 'pt-br',
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
};

export const provideTranslate = () => {
    return importProvidersFrom(TranslateModule.forRoot())
}