function getAboutPage(req, res) {
    res.render("about")
}

function getContactPage(req, res) {
    res.render("contact")
}

export default { getAboutPage, getContactPage }
