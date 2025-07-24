import React, { useState } from "react";
import { translateText } from '../utils/translate';

const coursesData = [
	{
		id: 1,
		title: "Python Programming Mastery",
		category: "programming",
		duration: "12 weeks",
		price: "Free",
		rating: 4.8,
		reviews: 2341,
		color: "from-blue-500 to-blue-600",
		description:
			"Master Python from basics to advanced concepts with hands-on projects and real-world applications.",
		badge: "Programming",
	},
	{
		id: 2,
		title: "Data Science Fundamentals",
		category: "data-science",
		duration: "16 weeks",
		price: "Free",
		rating: 4.9,
		reviews: 1876,
		color: "from-green-500 to-green-600",
		description:
			"Learn data analysis, visualization, and machine learning with Python and popular libraries.",
		badge: "Data Science",
	},
	{
		id: 3,
		title: "UI/UX Design Essentials",
		category: "design",
		duration: "10 weeks",
		price: "Free",
		rating: 4.7,
		reviews: 1234,
		color: "from-purple-500 to-purple-600",
		description:
			"Create stunning user interfaces and experiences with modern design principles and tools.",
		badge: "Design",
	},
	{
		id: 4,
		title: "Full Stack Web Development",
		category: "programming",
		duration: "14 weeks",
		price: "Free",
		rating: 4.8,
		reviews: 3456,
		color: "from-red-500 to-red-600",
		description:
			"Build complete web applications using modern technologies like React, Node.js, and MongoDB.",
		badge: "Programming",
	},
	{
		id: 5,
		title: "Digital Marketing Mastery",
		category: "business",
		duration: "8 weeks",
		price: "Free",
		rating: 4.6,
		reviews: 987,
		color: "from-yellow-500 to-yellow-600",
		description:
			"Master digital marketing strategies, SEO, social media, and analytics to grow businesses online.",
		badge: "Business",
	},
	{
		id: 6,
		title: "Machine Learning & AI",
		category: "data-science",
		duration: "20 weeks",
		price: "Free",
		rating: 4.9,
		reviews: 2567,
		color: "from-indigo-500 to-indigo-600",
		description:
			"Dive deep into machine learning algorithms, neural networks, and artificial intelligence applications.",
		badge: "Data Science",
	},
];

const categories = [
	{ key: "all", label: "All Courses" },
	{ key: "programming", label: "Programming" },
	{ key: "data-science", label: "Data Science" },
	{ key: "design", label: "Design" },
	{ key: "business", label: "Business" },
];

const LANGUAGES = [
	{ code: 'en', label: 'English' },
	{ code: 'hi', label: 'Hindi' },
	{ code: 'mr', label: 'Marathi' }
];

const CoursesPage = () => {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [targetLang, setTargetLang] = useState('en');
	const [apiKey, setApiKey] = useState(''); // Set this from props or context if needed
	const [translatedCourseId, setTranslatedCourseId] = useState(null);
	const [translatedDescription, setTranslatedDescription] = useState('');

	const filteredCourses =
		selectedCategory === "all"
			? coursesData
			: coursesData.filter((course) => course.category === selectedCategory);

	const handleTranslateCourse = async (course) => {
		if (targetLang === 'en') {
			setTranslatedDescription(course.description);
			setTranslatedCourseId(course.id);
			return;
		}
		try {
			setTranslatedDescription('Translating...');
			setTranslatedCourseId(course.id);
			const translated = await translateText(course.description, targetLang, apiKey);
			setTranslatedDescription(translated);
		} catch (err) {
			setTranslatedDescription('Translation failed.');
		}
	};

	return (
		<div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
						Explore Our Courses
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Discover AI-powered courses designed to accelerate your learning and
						career growth
					</p>
				</div>
				<div className="flex flex-wrap justify-center gap-4 mb-12">
					{categories.map((cat) => (
						<button
							key={cat.key}
							className={`course-filter px-6 py-2 rounded-full font-medium transition-colors ${
								selectedCategory === cat.key
									? "bg-blue-600 text-white"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}
							onClick={() => setSelectedCategory(cat.key)}
						>
							{cat.label}
						</button>
					))}
				</div>
				<div className="flex items-center gap-2 mb-4">
					<label htmlFor="lang-select" className="text-sm">Translate course descriptions to:</label>
					<select id="lang-select" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="border rounded px-2 py-1">
						{LANGUAGES.map(lang => (
							<option key={lang.code} value={lang.code}>{lang.label}</option>
						))}
					</select>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredCourses.map(course => (
						<div key={course.id} className="card group hover:scale-105 transition-all duration-300">
							<div
								className={`h-48 bg-gradient-to-br ${course.color} flex items-center justify-center`}
							>
								<span className="text-white text-2xl font-bold">
									{course.badge}
								</span>
							</div>
							<div className="p-6">
								<div className="flex items-center justify-between mb-2">
									<span
										className={`bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded`}
									>
										{course.badge}
									</span>
									<span className="text-sm text-gray-500">
										{course.duration}
									</span>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{course.title}
								</h3>
								<div className="mb-3">
									<span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
										{course.category}
									</span>
									<h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
										{course.title}
									</h3>
									<p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
										{(translatedCourseId === course.id && translatedDescription) ? translatedDescription : course.description}
									</p>
									<button className="btn-secondary mt-2" onClick={() => handleTranslateCourse(course)}>
										Translate Description
									</button>
								</div>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center">
										<div className="flex text-yellow-400">
											{Array(Math.floor(course.rating))
												.fill()
												.map((_, i) => (
													<span key={i}>★</span>
												))}
											{course.rating % 1 !== 0 && <span>☆</span>}
										</div>
										<span className="text-sm text-gray-500 ml-2">
											{course.rating} ({course.reviews})
										</span>
									</div>
								</div>
								<button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
									Enroll Now
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CoursesPage;