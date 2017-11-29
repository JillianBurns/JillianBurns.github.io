class Pages {
    constructor() {
        this.home = {
            title: "Home",
            url: "index.html"
        };
        this.websites = {
            title: "Websites",
            url: "index.html"
        };
        this.gd = {
            title: "Graphic Design",
            url: "index.html"
        };
        this.other = {
            title: "Other Projects",
            url: "index.html"
        };
        this.ongoing = {
            title: "Ongoing Projects",
            url: "index.html"
        };
        this.about = {
            title: "About",
            url: "index.html"
        };
        this.contact = {
            title: "Contact",
            url: "index.html"
        };

        this.page_links = [
            this.home, this.websites, this.gd,
            this.other, this.ongoing, this.about, this.contact
        ];
    }

    getPage(title) {
        return this.home;
    }

}