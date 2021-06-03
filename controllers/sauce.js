const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};
//modification
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};
//supression
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
//lecture unique
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  };
//lecture
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

//Like/Dislike
exports.likeASauce = (req, res, next) => {
   switch (req.body.like) {
     
    case 0:
      sauce.findOne()({ _id: req.params.id })
      .then((sauce) => {
        let arrayResult = sauce.usersDisliked.find(req.body.userId)
        if(arrayResult != null){
          Sauce.updateOne({_id: req.params.id}, {$pull:{usersDisliked: req.body.userId}, $inc:{dislikes: -1}})
        .then(() => res.status(201).json({ message: 'Modification effectuée !'}))
        .catch(error => res.status(400).json({ error }));
        }
      arrayResult = sauce.usersLiked.find(req.body.userId)
        if(arrayResult != null){
          sauce.updateOne({_id: req.params.id}, {$pull:{userLiked: req.body.userId}, $inc:{likes: -1}})
        .then(() => res.status(201).json({ message: 'Modification effectuée !'}))
        .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));  
         
      break;

    case 1:
      sauce.findOne()({ _id: req.params.id })
      .then((sauce) => {
        let disliked = sauce.usersDisliked.find(req.body.userId)
        if(disliked = null){
      sauce.updateOne({_id:req.params.id},{ $push:{userLiked: req.body.userId}, $inc:{likes: 1}})
      .then(() => res.status(200).json({ message: 'Sauce Likée !'}))
      .catch(error => res.status(400).json({ error })); 
      }else(console.error("Il y a une un probleme lors de votre requette veillez reessayer"));  
      })   
      .catch(error => res.status(400).json({ error }));    
      break;

    case -1:
      sauce.findOne()({ _id: req.params.id })
      .then((sauce) => {
        let liked = sauce.usersLiked.find(req.body.userId)
        if(disliked = null){
      sauce.updateOne({_id:req.params.id},{ $push:{userDisliked: req.body.userId}, $inc:{dislikes: 1}})
      .then(() => res.status(200).json({ message: 'Sauce DisLikée !'}))
      .catch(error => res.status(400).json({ error }));
        }else(console.error("Il y a une un probleme lors de votre requette veillez reessayer"));
      })
      .catch(error => res.status(400).json({ error }));
      break;
   
    default:
      console.error("Il y a une un probleme lors de votre requette veillez reessayer");
      break;
   } 
};

