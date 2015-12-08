exports.show = function(req, res ,next) {
    if (req.method == "GET") {
        //todo: check authentication
        return res.render("manager", {
            errors: req.flash('error'),
            user: req.user,
            commandlist: [ // some examples
                {
                    id: 12,
                    bangico: '',
                    bangicourl: 'http://www.google.com/s2/favicons?domain=youtube.com',
                    banglong: 'Youtube',
                    command: 'SPORTSTER SEVENTY-TWO™ HARLEY-DAVIDSON 72 NEW MODEL'
                },
                {
                    id: 47,
                    bangico: 'image',
                    bangicourl: '',
                    banglong: 'Image',
                    command: 'Les bronzés font du ski'
                },
                {
                    id: 22,
                    bangico: '',
                    bangicourl: 'http://www.google.com/s2/favicons?domain=www.google.fr/maps',
                    banglong: 'Url',
                    command: 'https://www.google.fr/maps/place/Resort+Barri%C3%A8re+Ribeauvill%C3%A9/@48.187902,7.3448102,17z/data=!4m7!1m4!3m3!1s0x0:0x0!2zNDjCsDExJzE2LjQiTiA3wrAyMCczOC45IkU!3b1!3m1!1s0x0000000000000000:0x4c4dafcfb10fed10'
                },
                {
                    id: 69,
                    bangico: '',
                    bangicourl: 'http://www.google.com/s2/favicons?domain=soundcloud.com',
                    banglong: 'SoundCloud',
                    command: 'LUDOMIR Shine'
                },
                {
                    id: 666,
                    bangico: 'my_location',
                    bangicourl: '',
                    banglong: 'Coordonées',
                    command: '48.187902,7.3448102'
                }]
        });
    }
};
