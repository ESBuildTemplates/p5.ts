// class Rate {

//     constructor( limit, callbackOn, callbackOff = ()=>false ){
//         this.limit = limit
//         this.callbackOn = callbackOn
//         this.callbackOff = callbackOff
//         this.old = Date.now()
//     }

//     tick(){
//         if(Date.now() - this.old > this.limit){
//             this.old = Date.now()
//             return this.callbackOn()
//         }else{
//             return this.callbackOff()
//         }
//     }
// }

// var rates = []

// function rate( ...args ){
//     let rate = rates.find(rate => rate.callbackOn === args[1])
//     if(!rate){
//         rate = new Rate( ...args )
//         rates.push(rate)
//     }
//     return rate.tick()
// }
