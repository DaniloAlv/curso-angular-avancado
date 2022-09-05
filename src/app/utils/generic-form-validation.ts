import { FormGroup } from "@angular/forms";

export class GenericFormValidation {
    constructor(private validationMessages: ValidationMessages) { }

    processarMensagens(container: FormGroup): { [key: string]: string }{
        
        let messages = {};
        for(let key in container.controls){
            if(container.controls.hasOwnProperty(key)){
                let c = container.controls[key];

                if(c instanceof FormGroup){
                    let childMessages = this.processarMensagens(c);
                    Object.assign(messages, childMessages);
                }
                else{
                    if(this.validationMessages[key]){
                        messages[key] = '';
                        if((c.dirty || c.touched) && c.errors){
                            Object.keys(c.errors).map(messageKey => {
                                if(this.validationMessages[key][messageKey]){
                                    messages[key] += this.validationMessages[key][messageKey] + '<br/>'
                                }
                            })
                        }
                    }
                }
            }
        }

        return messages;
    }
}

export interface DisplayMessage{
    [key: string]: string;
}

export interface ValidationMessages{
    [key: string]: { [key: string]: string }
}