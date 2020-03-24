const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file =>{
    return new Promise((resolve, reject) =>{
        fs.readFile(file, (err, data) =>{
            //console.log(err);
            if(err) reject('I could not find that file.');
            resolve(data);
        })
    });
};

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err =>{
            if(err) reject('Could not write file')
            resolve('success')
        })
    })
};

const getDogPic = async () =>{
    try{
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res1Pro = superagent.get(`https://dog.ceo/api/breeds/image/random/`);
        
        const res2Pro = superagent.get(`https://dog.ceo/api/breeds/image/random/`);

        const res3Pro = superagent.get(`https://dog.ceo/api/breeds/image/random/`);

        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        const imgs = all.map(el => el.body.message)
        console.log(imgs);


        await writeFilePro('dog-img.txt', imgs.join('\n'));
        console.log('Random dog image saved to file!');
    } catch (err) {
        console.log(err);
        throw(err);
    }

    return '2: READY '
}

(async () =>{
    try{
        console.log('1: Will get doc pics!');
        const x = await getDogPic();
        console.log(x);
        console.log('3: Done getting dog pic!');

    } catch (err) {
        console.log(err.message);  
    }
})();

/*
console.log('1: Will get doc pics!');
getDogPic().then(x => {
    console.log(x);
    console.log('3: Done getting dog pic!');

})
.catch(err => {
    console.log(err)
});
*/
// readFilePro(`${__dirname}/dogs.txt`)
//     .then(data => {
//         console.log(`Breed: ${data}`);
//         return superagent.get(`https://dog.ceo/api/breeds/image/random/`)
//     })
//     .then(res => {
//         console.log(res.body.message);
//         return writeFilePro('dog-img.txt', res.body.message);

//     })
//     .then(() => {
//         console.log('Random dog image saved to file!');
//     })
//     .catch(err => {
//         console.log(err.message);
//     });

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log(`Breed: ${data}`);

//     superagent
//         .get(`https://dog.ceo/api/breeds/image/random/`)
//         .then(res => {

//             if(err) return console.log(err.message);
//             console.log(res.body.message);
            
//             fs.writeFile('dog-img.txt',res.body.message, err => {
//                 if(err) return console.log(err.message);
//                 console.log('Random dog image saved to file!')
//             });

//         })
//         .catch(err => {
//             console.log(err.message);
//         })
        
// });

