export const attachFindQuery = (model) => {
	return (req, res, next) => {
		req.query = model.find({})
		next()
	}
}

export const attachAddQuery = (model) => {
	return (req, res, next) => {
		req.query = model.create(req.body)
		next()
	}
}

export const attachUpdateQuery = (model) => {
	return (req, res, next) => {
		req.query = model.updateMany({}, req.body)
		next()
	}
}

export const attachDeleteQuery = (model) => {
	return (req, res, next) => {
		req.query = model.deleteMany({})
		next()
	}
}
