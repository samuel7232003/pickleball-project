export default function navigateToPage(page:string, extra?: string){
  switch (page) {
    case "FEED": return "/newFeed";
    case "SEARCH": return "/search";
    case "LOGIN": return "/login";
    case "SIGNUP": return "/signup";
    case "CREATE_COURT": return `/createCourt/${extra}`;
    case "DETAIL_COURT": return `/detailCourt/${extra}`;
    case "PERSONAL": return `/personal/${extra}`;
    case "PAYMENT": return `/payment`;
    default: return "/";
  }
}