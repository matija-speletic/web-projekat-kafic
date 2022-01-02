export class Sto {
    constructor(stoIzBaze) {
        if (stoIzBaze != null && stoIzBaze != undefined) {
            this.id = stoIzBaze.id;
            this.brojOsoba = stoIzBaze.brojOsoba;
            this.dozvoljenoPusenje = stoIzBaze.dozvoljenoPusenje;
            this.x = stoIzBaze.xPozicija;
            this.y = stoIzBaze.yPozicija;
            this.slobodan = stoIzBaze.slobodan;
            this.imaStola = true;
            this.kafic = null;
        }
        else
            this.imaStola = false;
        this.container = null;
    }

    crtajSto(host, lista, kafic) {

        this.kafic = kafic;

        let stoTD = document.createElement("td");
        host.appendChild(stoTD);
        this.container = stoTD;

        if (this.imaStola) {
            let stoDugme = document.createElement("button");
            stoDugme.className = "dugme_sto";
            stoDugme.classList.add(this.slobodan ? "slobodan_sto" : "zauzet_sto");
            stoDugme.innerHTML = (this.dozvoljenoPusenje ? "🚬" : "🚭") + this.brojOsoba;
            //stoDugme.title = this.id;
            stoTD.appendChild(stoDugme);
            //console.log(lista);
            stoDugme.addEventListener("click", () => {
                if (!this.slobodan)
                    this.ucitajNarudzbinu(lista);
                else {
                    lista.container.querySelector(".ukupno .ukupan_iznos").innerHTML = "0.00";
                    lista.container.querySelector(".napojnica .ukupan_iznos").innerHTML = "0.00";
                    kafic.listaNarucenih.isprazniListu();
                    lista.container.querySelector(".lista_proizvoda").innerHTML = "Sto je slobodan...";
                    lista.container.querySelector(".uputstvo_labela").innerHTML = "Uputstvo: ";
                    lista.container.querySelector(".konobar_nadimak").innerHTML = "";
                    kafic.selektovanaNarudzbinaID = -1;
                }

                this.kafic.selektovaniSto = this;

            })
        }
    }

    ucitajNarudzbinu(lista) {
        //console.log(lista);
        fetch("https://localhost:5001/Narudzbina/PreuzmiNarudzbinuSaStola/" + this.id, {
            method: "GET"
        }).then(s => {
            if (s.ok) {
                s.json().then(narudzbina => {
                    //console.log(narudzbina);
                    lista.naruceniProizvodi = [];
                    let ukupno = 0;
                    //console.log(narudzbina.proizvodi);
                    narudzbina.proizvodi.forEach(proizvod => {
                        proizvod.brojIzabranih = 1;
                        lista.dodajProizvodUListu(proizvod);
                        lista.prikaziListuNarucenih();
                        ukupno += proizvod.cena;
                    });
                    lista.container.querySelector(".ukupno .ukupan_iznos").innerHTML = (ukupno + narudzbina.napojnica) + ".00";
                    lista.container.querySelector(".napojnica .ukupan_iznos").innerHTML = narudzbina.napojnica + ".00";
                    lista.container.querySelector(".uputstvo_labela").innerHTML = "Uputstvo: "
                        + (narudzbina.dodatnoUputstvo != null ? narudzbina.dodatnoUputstvo : "");
                    lista.container.querySelector(".konobar_nadimak").innerHTML = narudzbina.konobar.punoIme;

                    this.kafic.selektovanaNarudzbinaID = narudzbina.id;
                    this.kafic.selektovaniStoID = this.id;

                })
            }
        })
    }
}