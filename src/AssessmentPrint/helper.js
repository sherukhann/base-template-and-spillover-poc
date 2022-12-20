import { IMAGE_POSITIONS } from "./constant";

// main template
import mainInfoSection from './assets/main_info_section.png';
import mainSnoSection from './assets/main_sno_section.png';
import mainFooterSection from './assets/main_footer_section.png';

// even template
import evenInfoSection from './assets/even_info_section.png';
import evenSnoSection from './assets/even_sno_section.png';
import evenFooterSection from './assets/even_footer_section.png';

// odd template
import oddInfoSection from './assets/odd_info_section.png';
import oddSnoSection from './assets/odd_sno_section.png';
import oddFooterSection from './assets/odd_footer_section.png';


export function getImage(position, index) {

    if( index == 0) {
      switch(position){
        case IMAGE_POSITIONS.TOP: {
          return mainInfoSection
        };
        case IMAGE_POSITIONS.MIDDLE: {
          return mainSnoSection
        };
        case IMAGE_POSITIONS.FOOTER: {
          return mainFooterSection
        };
        default: {
          return mainInfoSection
        }
      }
    } else if(index % 2 == 0) {
      // odd number case
      switch(position){
        case IMAGE_POSITIONS.TOP: {
          return oddInfoSection
        };
        case IMAGE_POSITIONS.MIDDLE: {
          return oddSnoSection
        };
        case IMAGE_POSITIONS.FOOTER: {
          return oddFooterSection
        };
        default: {
          return oddInfoSection
        }
      }
    } else {
      // even case
      switch(position){
        case IMAGE_POSITIONS.TOP: {
          return evenInfoSection
        };
        case IMAGE_POSITIONS.MIDDLE: {
          return evenSnoSection
        };
        case IMAGE_POSITIONS.FOOTER: {
          return evenFooterSection
        };
        default: {
          return evenInfoSection
        }
      }
    }
  }