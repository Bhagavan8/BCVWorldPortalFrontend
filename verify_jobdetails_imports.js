
import * as BiIcons from 'react-icons/bi';

const importsToCheck = [
  'BiCopy', 'BiListUl', 'BiShare', 'BiX', 'BiHome', 'BiChevronRight', 'BiBriefcase', 'BiBulb', 
  'BiUserCircle', 'BiSolidUserBadge', 'BiLogOut', 'BiLogIn', 'BiUserPlus', 
  'BiWifiOff', 'BiRefresh', 'BiError', 'BiSolidUser', 
  'BiSolidBadgeCheck', 'BiMapPin', 'BiPlusCircle', 'BiSolidGraduation', 'BiCalendar', 'BiShow', 
  'BiHeart', 'BiSolidHeart', 'BiHash', 'BiMoney', 'BiBookmark', 'BiSolidBookmark', 'BiFile', 
  'BiWrench', 'BiCheckCircle', 'BiInfoCircle', 'BiShareAlt', 'BiLogoWhatsapp', 'BiLogoLinkedin', 
  'BiLogoFacebook', 'BiLogoTwitter', 'BiLogoTelegram', 'BiLink', 'BiBuilding', 'BiGroup', 'BiCommentDots', 
  'BiChat', 'BiLinkExternal', 'BiEnvelope', 'BiChevronLeft'
];

const missing = importsToCheck.filter(name => !BiIcons[name]);

if (missing.length > 0) {
  console.log('Missing icons:', missing);
} else {
  console.log('All icons exist!');
}
