locations_oldSt = [
	
	turner = {
		"id":"turner",
		"nickname":"Turner",
		"name":"60 Turner Street",
		"function":"Turner is home to the classrooms for the Osher Lifelong Learning Institute at Brandeis.",
		"description":"The Office of Financial Affairs and Treasury Services is dedicated to providing the community with timely and accurate financial information and accounting services in support of students, faculty and staff.",
		"coordinates":[
			new Point(42.362090, -71.264160), 
			new Point(42.362017, -71.263813),
			new Point(42.361845, -71.263886),
			new Point(42.361886, -71.264220)],
		"category":["administrative","academics"],
		"entrances":["turner_e01"],
		"area":["lower campus"]
	},

	rabbSchool = {
		"id":"rabbSchool",
		"name":"The Rabb School of Continuing Studies",
		"nickname":"Rabb School",
		"coordinates":[
			new Point(42.363061,-71.258924),
			new Point(42.36298,-71.25929),  
			new Point(42.362872,-71.259233),
			new Point(42.362961,-71.258887)],
		"function":"The Rabb School is home to continuing education, graduate and professional programs, OLLI @ Brandeis, and summer programs, including the Justice Brandeis Semester (JBS).",
		"category":["academics"],
		"nearby":["lemberg","slosberg"],
		"entrances":["rabbSchool_e01","rabbSchool_e02","rabbSchool_e03"],
		"area":["lower campus"]
		},

	{
		"id":"lemberg",
		"nickname":"Lemberg",
		"name":"Gersh and Sarah Lemberg Children's Center",
		"function":"Lemberg offers childcare for children under age seven. Brandeis students majoring in education can work and teach here.",
		"description":"Located adjacent to the Brandeis University campus, the Gersh & Sarah Lemberg Children's Center develops children, families, teachers, researchers, and ultimately the field of early childhood education itself in a warm family environment.",
		"coordinates":[
			new Point(42.363665, -71.258979),
			new Point(42.363665, -71.259105),
			new Point(42.363508, -71.259228),
			new Point(42.363443, -71.259073),
			new Point(42.363404, -71.258886),
			new Point(42.363630, -71.258806)
		],
		"category":["academics"],
		"nearby":["rabbSchool","slosberg"],
		"entrances":["lemberg_e01"],
		"area":["lower campus"]
	},

]

function Point(x,y) {
	this.x = x;
	this.y = y;
}