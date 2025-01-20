export const filterQuery = () => {
	return (req, res, next) => {
		req.query = req.query.where({ slug: req.params.slug })
		next()
	}
}
