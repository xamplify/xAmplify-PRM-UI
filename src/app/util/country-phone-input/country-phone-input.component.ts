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
  @Input() mobileNumber: string = '';
  @Input() isUploadCsv: boolean = false;
  selectedCountry: any;
  filteredCountries: any;
  isOpen: boolean = false;
  searchQuery: string = '';
  isInvalidMobileNumber: boolean = false;
  @Output() clickOutside = new EventEmitter<void>();
  @Output() mobileNumberEventEmitter = new EventEmitter<any>();

  constructor(public countryNames: CountryNames, private eRef: ElementRef) {
    this.filteredCountries = [...this.countryNames.countriesMobileCodes];
  }

  ngOnInit() {
    if (this.mobileNumber) {
      this.autoDetectCountry();
      this.validateMobileNumber();
    } else {
      this.setDefaultCountry();
    }
  }

  validateMobileNumber() {
    if (this.mobileNumber) {
      const phone = parsePhoneNumberFromString(this.mobileNumber);
      if (phone && isValidPhoneNumber(this.mobileNumber)) {
        this.isInvalidMobileNumber = false;
      } else {
        this.isInvalidMobileNumber = true;
      }
    } else {
      this.isInvalidMobileNumber = false;
    }
    this.mobileNumberEventEmitter.emit({ isInvalidMobileNumber: this.isInvalidMobileNumber, mobileNumber: this.mobileNumber });
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
      if (this.mobileNumber.startsWith(country.dial_code)) {
        if (country.dial_code.length > maxLength) {
          maxLength = country.dial_code.length;
          matchedCountry = country;
          break;
        }
      }
    }

    if (matchedCountry) {
      this.selectedCountry = matchedCountry;
      const userNumber = this.mobileNumber.substring(matchedCountry.dial_code.length);
      this.mobileNumber = matchedCountry.dial_code + ' ' + userNumber;
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
    if (value) {
      return value.toLowerCase();
    }
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

}
