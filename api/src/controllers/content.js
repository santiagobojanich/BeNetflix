const {Content, Category} = require ('../db')
const axios = require ('axios')

const createContent = async (req,res) => {
 const {name,image,trailer,description,categories} = req.body
 try{

 
 if(!name || !image || !trailer || !categories || !description) return res.status(400).send('Missing information') 

 let verifyContent = await Content.findOne({where:{name: name}})
 if (verifyContent) return res.status(400).send({message:'This content already exist'})
 
 let content = await Content.create({
    name:name,
    image: image,
    trailer: trailer,
    description: description,
    coments:[]
})
 
 for(i=0; i<categories.length; i++){
    let category = await Category.findOne({where:{name: categories[i]}})
    await content.addCategories(category)
 }

 
 return res.status(200).send({message: 'Content created'})
}
 catch{
   return res.status(404).send({message:'Error in createContent'})
} }


const getContent = async (req,res) => {
  let {name} = req.query
  let content = await Content.findAll({
    include:{
    model: Category,
    attributes:['name'],
    throug: {
        attributes: [],
    } } })
  
 content = content.map(content => {
 return {
     id: content.id,
     name: content.name,
     image: content.image,
     trailer: content.trailer,
     description: content.description,
     categories: content.Categories.map(cat => cat.name)
 }
 })
 if(name) {
 let content2 = content.filter(cont => cont.name.toLowerCase().includes(name.toLowerCase()))
  return res.status(200).send(content2)
 }

  return res.status(200).send(content)
} 

const getDetail = async (req,res) => {
const {id} = req.params
try{ 
    let content = await Content.findAll({
        where:{id: id}, include:{
            model:Category,
            attributes:['name']
        }
    })

   content = content.map(content => {
    return {
        id: content.id,
     name: content.name,
     image: content.image,
     trailer: content.trailer,
     description: content.description,
     categories: content.Categories.map(cat => cat.name),
     coments: content.coments
    }
   })

  return res.status(200).send(content)
  } catch(e){
    return res.status(400).send({message: 'ERROR IN GETDETAIL'})
  }
}

const deleteContent = async (req,res) => {
 try{  let {id} = req.params 
  await Content.destroy({
    where:{id:id}
  })
  return res.status(200).send({message: 'Content Deleted'})
} catch(e){
  return res.status(400).send({message: 'ERROR in deleteContent'})
}  
}

const updateContent = async (req,res) => {
   try{const {id} = req.params 
    const {name,image,trailer,description} = req.body
    let content = await Content.findOne({where:{id:id}})
    
   if(!name || !image || !trailer || !description) {
    return res.status(400).send({message: 'ALL FIELDS REQUIRED'})
   }
    
    await content.update({
        name:name,
        image: image,
        trailer: trailer,
        description: description   
    })
   return res.status(200).send({message: 'Content updated'})
  } catch(e){
    console.log(e)
    return res.status(400).send({message: "ERROR in updateContent"})
  }
  }

 const makeComent= async (req,res) => {
    const {contentId, coment} = req.body
   try{
     let content = await Content.findOne({where:{id:contentId}})
     await content.update({
      coments: [...content.coments, coment]
     })
     return res.status(200).send({message:'Coment ADDED'})
    } catch(e){
      return res.status(400).send({message:'ERROR in makeComent'})
    }
  }


  const demoContent = async () => {
  try{
  let input = {
    username:'admin',
    password:'admin'
   }
   
   let contentToCreate = [
     {name:"Star Wars: Episode 1", image:"https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/7DAD099DEE5CE5649C32EFFB4497C3060B5AD03E22AF200ABDBEFE30BC194FA6/scale?width=1200&aspectRatio=1.78&format=jpeg", trailer:"bD7bpG-zDJQ", categories:["Action", "Adventure"] ,description:"Obi-Wan Kenobi (Ewan McGregor) es un joven aprendiz caballero Jedi bajo la tutela de Qui-Gon Jinn (Liam Neeson) ; Anakin Skywalker (Jake Lloyd), quien despu??s ser?? padre de Luke Skywalker y se convertir?? en Darth Vader, solamente es un ni??o de 9 a??os. Cuando la Federaci??n de Comercio corta todas las rutas al planeta Naboo, Qui-Gon y Obi-Wan son asignados para solucionar el problema." },
     {name:"Star Wars: Episode 2", image:"https://images-na.ssl-images-amazon.com/images/S/pv-target-images/ceefcaee4f0c3147528caf242346221eedfe95e568800472e1088187532a9e49._RI_V_TTW_.jpg", trailer:"gYbW1F_c9eM", categories:["Action", "Adventure"] ,description:"En el Senado Gal??ctico reina la inquietud. Varios miles de sistemas solares han declarado su intenci??n de abandonar la Rep??blica. Este movimiento separatista, liderado por el misterioso conde Dooku, ha provocado que al limitado n??mero de caballeros Jedi les resulte dif??cil mantener la paz y el orden en la galaxia. La senadora Amidala, antigua Reina de Naboo, regresa al Senado Gal??ctico para dar su voto en la cr??tica cuesti??n de crear un ej??rcito de la Rep??blica que ayude a los desbordados Jedi." },
     {name:"Star Wars: Episode 3", image:"http://4.bp.blogspot.com/-ibCgvee1I68/Vn5T8Bul5II/AAAAAAAAL5A/Tw1qwkhIuU8/s1600/Venganzasithportada.JPG", trailer:"5UnjrG_N8hU&t=5s", categories:["Action, Adventure"] ,description:"??Guerra! La Rep??blica se desmorona bajo los ataques del despiadado Lord Sith, el conde Dooku. Hay h??roes en ambos bandos, pero el mal est?? por doquier. En una contundente jugada, el diab??lico l??der droide, el general Grievous, ha irrumpido en la capital de la Rep??blica y ha secuestrado al Canciller Palpatine, l??der del senado Gal??ctico. Mientras el ej??rcito droide separatista trata de huir con su valioso reh??n, dos caballeros Jedi inician una misi??n desesperada para liberar al Canciller cautivo." },
     {name:"Thor: Love & Thunder", image:"https://cloudfront-us-east-1.images.arcpublishing.com/infobae/TYE5GPOOMNGEPLCE22YRY3U3WA.jpg", trailer:"tgB1wUcmbbw", categories:["Comedy", "Adventure"] ,description:"Secuela de 'Thor: Ragnarok' en la que el Dios del Trueno contar?? con Lady Thor como acompa??ante." },
     {name:"Avengers: Endgame", image:"https://i.pinimg.com/originals/c2/49/78/c2497819e6b99cc35c73a9fcde98a6f4.jpg", trailer:"znk2OICHbjY", categories:["Action"] ,description:"Despu??s de los eventos devastadores de 'Avengers: Infinity War', el universo est?? en ruinas debido a las acciones de Thanos, el Tit??n Loco. Con la ayuda de los aliados que quedaron, los Vengadores deber??n reunirse una vez m??s para intentar detenerlo y restaurar el orden en el universo de una vez por todas." },
     {name:"The Joker", image:"https://i0.wp.com/bunker158.com/wp-content/uploads/2020/05/the-joker-2019-arthur-fleck-prime1-blitzway-bunker158-statue-1.jpg?fit=1060%2C1500&ssl=1", trailer:"zAGVQLHvwOY", categories:["Action", "Drama"] ,description:"Arthur Fleck adora hacer re??r a la gente, pero su carrera como comediante es un fracaso. El repudio social, la marginaci??n y una serie de tr??gicos acontecimientos lo conducen por el sendero de la locura y, finalmente, cae en el mundo del crimen." },
     {name:"Hancock", image:"https://r1.abcimg.es/resizer/resizer.php?imagen=https%3A%2F%2Fstatic3.abc.es%2Fmedia%2Fpeliculas%2F000%2F026%2F975%2Fhancock-1.jpg&nuevoancho=683&medio=abc", trailer:"KS5E8r82l2g", categories:["Action", "Comedy", "Romantic"] ,description:"Hancock, un h??roe bastante impopular, se siente insatisfecho y atormentado. Con sus acciones her??icas, consigue salvar muchas vidas, pero, al mismo tiempo, provoca aut??nticas cat??strofes." },
     {name:"Uncharted", image:"https://i.blogs.es/89c7de/uncharted-cartel/1366_2000.jpeg", trailer:"kVgsnqAp0Kk", categories:["Adventure", "Action"] ,description:"El cazador de tesoros Victor Sullivan recluta a Nathan Drake para que lo ayude a recuperar una fortuna de 500 a??os de antig??edad. Lo que comienza como un atraco se convierte en una competencia contra el despiadado Santiago Moncada." },
     {name:"Rocky I", image:"https://images-na.ssl-images-amazon.com/images/S/pv-target-images/2596301d69a4d0ce86a41d4ef6fdb5e19eabe66ac45cab63eeb97dc45d840254._RI_V_TTW_.jpg", trailer:"7RYpJAUMo2M", categories:["Action"] ,description:"Rocky Balboa es un desconocido boxeador de Philadelphia a quien se le ofrece la posibilidad de alcanzar la fama y ganar el t??tulo mundial de los pesos pesados enfrent??ndose al actual campe??n, Apollo Creed. Con una gran fuerza de voluntad, Rocky se prepara concienzudamente para el combate y tambi??n para los cambios que acabar??n produci??ndose en su vida." },
     {name:"Rocky II", image:"https://www.ecartelera.com/carteles/5200/5224/001_m.jpg", trailer:"6PSSxAGSiCY", categories:["Action"] ,description:"Tras la dura pelea contra Apollo Creed y el embarazo de Adrien, Rocky ha colgado los guantes de boxeo. Sin embargo, su ingenuidad a la hora de llevar las finanzas le deja a ??l y a su familia en una situaci??n dif??cil, por lo que considera aceptar la oferta de revancha de Apollo para una segunda pelea. Reticente, acepta cuando ??ste le llama cobarde, a pesar de las negativas de Adrien, quien teme que la pelea pueda acabar con el ya retirado Rocky." },
     {name:"Indiana Jones", image:"https://upload.wikimedia.org/wikipedia/en/8/8c/Indiana_Jones_and_the_Last_Crusade.png", trailer:"0xQSIdSRlAk", categories:["Adventure", "Action"] ,description:"El intr??pido explorador Indiana Jones tiene que rescatar a su padre, un arque??logo que ha desaparecido mientras buscaba el Santo Grial. Siguiendo las pistas de la libreta de su padre, Indiana llega a Venecia, donde recibe la ayuda de una profesora especialista. Los dos intentar??n rescatar a Henry Jones y, de paso, hacerse con la preciada reliquia, que tambi??n quieren los nazis." },
    {name:"Mad Max", image:"https://image.tmdb.org/t/p/w500/mnVZLdo9C4X80sJmgcGNpMNCbgk.jpg", trailer:"hEJnMQG9ev8", categories:["Action", "Adventure"] ,description:"Tras la guerra termonuclear que ha convertido a la Tierra en un p??ramo, el antiguo polic??a Max Rockatansky, atormentado por los esp??ritus de aquellos a los que no pudo proteger, se ha convertido en un hombre con un solo instinto: sobrevivir. Sin embargo, se ve arrastrado a formar parte de un grupo que huye a trav??s del desierto en un War Rig. Enfurecido, el Se??or de la Guerra moviliza a todas sus bandas y persigue implacablemente a Max." },
    {name:"Terminator", image:"https://r2.abcimg.es/resizer/resizer.php?imagen=https%3A%2F%2Fstatic4.abc.es%2Fmedia%2Fpeliculas%2F000%2F001%2F631%2Fterminator-1.jpg&nuevoancho=690&medio=abc", trailer:"k64P4l2Wmeg", categories:["Action"] ,description:"En el a??o 2029 las m??quinas dominan el mundo. Los rebeldes que luchan contra ellas tienen como l??der a John Connor, un hombre que naci?? en los a??os ochenta. Para eliminarlo y as?? acabar con la rebeli??n, las m??quinas env??an al pasado el robot Terminator con la misi??n de matar a Sarah Connor, la madre de John, e impedir as?? su nacimiento. Sin embargo, un hombre del futuro intentar?? protegerla." },
    {name:"Terminator 2: Judgment Day ", image:"https://es.web.img3.acsta.net/pictures/17/11/14/12/15/4371161.jpg", trailer:"CRRlbK5w8AE", categories:["Action"] ,description:"Algunos a??os antes, un viajero del tiempo le revel?? a la madre de John que su hijo ser??a el salvador de la humanidad. Cuando un nuevo androide mejorado llega del futuro para asesinar a John, un viejo modelo ser?? enviado para protegerle." },
    {name:"Marley & me", image:"https://m.media-amazon.com/images/M/MV5BYTdiZGY1MTctMjQzYy00ZTc0LThiM2EtY2U2OGIwYjBiNTM2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg", trailer:"jTDCJd_HBII", categories:["Comedy", "Drama"] ,description:"John y Jenny deciden dejar atr??s los duros inviernos de Michigan para iniciar sus nuevas vidas en la soleada West Palm Beach. Los dos consiguen empleo en dos peri??dicos rivales y afrontan los retos del matrimonio." }
  ]
  
  let authorizeAdmin = await axios.post("http://localhost:3001/api/auth/signIn", input)
 let  Admintoken = authorizeAdmin.data.token
 let accesstoken = {
  token: Admintoken
 } 

for(let i=0; i<contentToCreate.length; i++){
  await axios.post(
    "http://localhost:3001/api/content",
    contentToCreate[i],
    { headers: accesstoken }
  )
}
  } catch (e) {
    console.log(e)
  }  
}  

module.exports = {
    createContent,
    getContent,
    getDetail,
    deleteContent,
    updateContent,
    demoContent,
    makeComent
}