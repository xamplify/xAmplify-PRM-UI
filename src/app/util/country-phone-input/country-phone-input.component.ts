import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CountryNames } from 'app/common/models/country-names';
import parsePhoneNumberFromString, { isValidPhoneNumber } from 'libphonenumber-js';

declare var $: any;

@Component({
  selector: 'app-country-phone-input',
  templateUrl: './country-phone-input.component.html',
  styleUrls: ['./country-phone-input.component.css'],
  providers: [CountryNames]
})
export class CountryPhoneInputComponent implements OnInit {

  @Input() maxlength: number = 15;
  @Input() placeholder: string = '';
  @Input() countryCode: string = '';
  @Input() mobileNumber: string = '';
  @Input() isUploadCsv: boolean = false;
  selectedCountry: any;
  filteredCountries: any;
  isOpen: boolean = false;
  searchQuery: string = '';
  isValidMobileNumber: boolean = true;
  @Output() clickOutside = new EventEmitter<void>();
  @Output() mobileNumberEventEmitter = new EventEmitter<any>();
  errorMessage: string;

  constructor(public countryNames: CountryNames, private eRef: ElementRef) {
    this.filteredCountries = [...this.countryNames.countriesMobileCodes];
  }

  ngOnInit() {
    if (this.mobileNumber) {
      this.autoDetectCountry();
    } else {
      this.setDefaultCountry();
    }
  }

  ngOndestroy() {
    this.isOpen = false;
    this.searchQuery = '';
    this.selectedCountry = [];
    this.filteredCountries = [];
    this.clickOutside.unsubscribe();
  }

  validateMobileNumber() {
    let numberWithoutCode = '';
    let cleanDialCode = '';
    if (this.mobileNumber) {
      this.isValidMobileNumber = isValidPhoneNumber(this.mobileNumber);
      const cleanNumber = this.mobileNumber.replace(/[^\d+]/g, '');
      for (const country of this.countryNames.countriesMobileCodes) {
        cleanDialCode = country.dial_code.replace(/[^\d+]/g, '');
        if (cleanNumber.startsWith(cleanDialCode)) {
          numberWithoutCode = cleanNumber.substring(cleanDialCode.length).trim();
          if (!numberWithoutCode) {
            this.isValidMobileNumber = true;
          }
          this.mobileNumber = cleanDialCode + ' ' + numberWithoutCode;
          break;
        }
      }
    } else {
      this.isValidMobileNumber = true;
    }

    if (!this.isValidMobileNumber) {
      this.errorMessage = 'Please enter a valid mobile number';
    }
    this.mobileNumberEventEmitter.emit({ isValidMobileNumber: this.isValidMobileNumber, mobileNumber: this.mobileNumber, selectedCountry: this.selectedCountry });
  }

  numbersOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
      this.filterCountries();
      setTimeout(() => {
        const inputElement = document.getElementById('phoneInput');
        if (inputElement) {
          inputElement.focus();
        }
        this.scrollToSelectedCountry()
      }, 0);
    }
  }

  setDefaultCountry() {
    this.selectedCountry = [];
    this.selectedCountry = this.countryNames.countriesMobileCodes[188];
    this.mobileNumber = this.selectedCountry.dial_code + ' ';
  }

  autoDetectCountry() {
    let maxLength = 0;
    this.selectedCountry = [];
    let matchedCountry = null;
    for (const country of this.countryNames.countriesMobileCodes) {
      if (this.countryCode && this.countryCode === country.code) {
        matchedCountry = country;
        break;
      }

      if (!this.countryCode && this.mobileNumber.startsWith(country.dial_code)) {
        if (country.dial_code.length > maxLength) {
          maxLength = country.dial_code.length;
          matchedCountry = country;
          break;
        }
      }
    }

    if (matchedCountry) {
      this.selectedCountry = matchedCountry;
      const cleanNumber = this.mobileNumber.replace(/[^\d+]/g, '');
      const userNumber = cleanNumber.substring(matchedCountry.dial_code.length);
      this.mobileNumber = matchedCountry.dial_code + ' ' + userNumber;
      this.validateMobileNumber();
    } else {
      this.isValidMobileNumber = false;
      this.errorMessage = 'Please select the country code';
    }
  }

  selectCountry(country: any) {
    let numberWithoutCode = this.mobileNumber;
    if (this.selectedCountry) {
      const cleanDialCode = this.selectedCountry.dial_code ? this.selectedCountry.dial_code.replace(/[^\d+]/g, '') : '';
      const cleanNumber = this.mobileNumber.replace(/[^\d+]/g, '');
      numberWithoutCode = cleanNumber.substring(cleanDialCode.length).trim();
    }

    // Apply new country code
    this.mobileNumber = country.dial_code + ' ' + numberWithoutCode;
    this.selectedCountry = country;
    this.isOpen = false;
    if (numberWithoutCode) {
      this.validateMobileNumber();
    }
  }

  filterCountries() {
    if (!this.searchQuery) {
      this.filteredCountries = [...this.countryNames.countriesMobileCodes];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCountries = this.countryNames.countriesMobileCodes.filter(country =>
        country.name.toLowerCase().includes(query) || country.dial_code.includes(query));
    }
  }

  convertIntoLowerCase(value: string) {
    return value.toLowerCase();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.eRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const dialCode = this.selectedCountry.dial_code + ' ';
    const dialCodeLength = dialCode.length;
    if (cursorPos >= dialCodeLength && selectionEnd >= dialCodeLength) {
      return;
    }

    if (cursorPos < dialCodeLength || selectionEnd < dialCodeLength) {
      if (event.ctrlKey && event.key === 'a') {
        return;
      }
      if (event.ctrlKey && (event.key === 'x' || event.key === 'v')) {
        event.preventDefault();
        return;
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        return;
      }
      if (event.key.length === 1) {
        event.preventDefault();
        return;
      }
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const dialCode = this.selectedCountry.dial_code + ' ';
    if (!input.value.startsWith(dialCode)) {
      const numbersOnly = input.value.replace(/\D/g, '');
      const userNumber = numbersOnly.slice(dialCode.replace(/\D/g, '').length);
      input.value = dialCode + userNumber;
      setTimeout(() => {
        input.setSelectionRange(dialCode.length, dialCode.length);
      });
    }
  }

  scrollToSelectedCountry() {
    const container = this.eRef.nativeElement.querySelector('.dropdown-options');
    const selected = this.eRef.nativeElement.querySelector('.selected');
    if (container && selected) {
      container.scrollTop = selected.offsetTop - container.offsetTop;
    }
  }

}
