export function getRouter(userRouter=[], allRouter = []) {
  let userRealRouter = [];
  for (let ai=0; ai < allRouter.length; ai++) {
    for (let ui=0; ui < userRouter.length; ui++) {
      if (userRouter[ui].title == allRouter[ai].meta.name) {
        allRouter[ai].hidden = true;
        userRealRouter.push(allRouter[ai]);
        if (userRouter[ui].children !=undefined && userRouter[ui].children.length > 0) {
          getRouter(userRouter[ui].children, allRouter[ai].children)
        }
      }
    }
  }
  return userRealRouter;
}
  
  