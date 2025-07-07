import { Injectable } from '@angular/core';
import { SecureStorage, STORAGE, CRYPTO } from '@jihyunlab/web-secure-storage'

const localStorage = SecureStorage(STORAGE.LOCAL, CRYPTO.AES, "XoprikeChAsWE52=w2boswOTiFREfe", 128);

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public saveData(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  public getData(key: string) {
    return localStorage.getItem(key);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

}