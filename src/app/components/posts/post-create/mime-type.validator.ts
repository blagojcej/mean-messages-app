import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if (typeof(control.value)==='string') {
        // This is valid
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(fileReader.result).subarray(0, 4);
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }

            if(isValid) {
                //return null if mime type is valid
                observer.next(null);
            } else {
                //If it's not valid we're returning any object we want
                observer.next({invalidMimeType: true});
            }
            //To tell to any observers we're done with checking
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });

    return frObs;
}