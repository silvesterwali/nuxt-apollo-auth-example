import {routeOption,getMatchedComponents,normalizePath} from "~/helper/utils"

export default (ctx) => {

  // Disable middleware if options: { auth: false } is set on the route
  // TODO: Why Router is incompatible?
  if(routeOption(ctx.route,'auth',false)){
    return
  }

  const matches=[]

  const Components =getMatchedComponents(ctx.route,matches)

   // Disable middleware if no route was matched to allow 404/error page
  if(!Components.length){
    return
  }
  const login="/login"
  const callback ="/"

  const pageIsInGuestMode =routeOption(ctx.route,'auth','guest')

  const insidePage=(page)=>normalizePath(ctx.route.path,ctx)===normalizePath(page,ctx)


  const hasToken = !!ctx.app.$apolloHelpers.getToken()

  if(hasToken){
    /**
     * Authorized
     * 
    */
    if(!login||insidePage(login) || pageIsInGuestMode){
      ctx.redirect("/")
    }
  }else if(!pageIsInGuestMode && (!callback||!insidePage(callback))){
    ctx.redirect("/login")     
  }

}
