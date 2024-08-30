import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PYQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [pyqs, setPyqs] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const papersPerPage = 6; // Number of papers per page

    useEffect(() => {
        const fetchPYQs = async () => {
            try {
                const response = await fetch(
                    'https://panel.studentsenior.com/api/pyqs'
                );
                const data = await response.json();
                setPyqs(data);
            } catch (error) {
                console.error('Error fetching PYQs:', error);
            }
        };

        fetchPYQs();
    }, []);

    const courses = [...new Set(pyqs.map((paper) => paper.course))];
    const branches = selectedCourse
        ? [
              ...new Set(
                  pyqs
                      .filter((paper) => paper.course === selectedCourse)
                      .flatMap((paper) => paper.branch)
              ),
          ]
        : [];
    const examTypes = [...new Set(pyqs.map((paper) => paper.examType))];

    const filteredPapers = pyqs.filter((paper) => {
        return (
            (selectedYear ? paper.year === selectedYear : true) &&
            (selectedSemester ? paper.semester === selectedSemester : true) &&
            (selectedBranch ? paper.branch.includes(selectedBranch) : true) &&
            (selectedCourse ? paper.course === selectedCourse : true) &&
            (selectedExamType ? paper.examType === selectedExamType : true) &&
            (searchTerm
                ? paper.subjectName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true)
        );
    });

    // Pagination logic
    const indexOfLastPaper = currentPage * papersPerPage;
    const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
    const currentPapers = filteredPapers.slice(
        indexOfFirstPaper,
        indexOfLastPaper
    );

    const totalPages = Math.ceil(filteredPapers.length / papersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container bg-sky-100 min-h-screen min-w-full">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-4 md:p-8 bg-sky-100">
                <h1 className="text-3xl font-bold mb-5 text-center">
                    Previous Year Questions (PYQ)
                </h1>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Subject Name"
                        className="p-2 border rounded-md w-full sm:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedYear(e.target.value)}
                        value={selectedYear}
                    >
                        <option value="">All Years</option>
                        <option value="2021-2022">2021-2022</option>
                        <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        value={selectedSemester}
                    >
                        <option value="">All Semesters</option>
                        <option value="1">1st</option>
                        <option value="2">2nd</option>
                        <option value="3">3rd</option>
                        <option value="4">4th</option>
                        <option value="5">5th</option>
                        <option value="6">6th</option>
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedBranch(''); // Reset branch when course changes
                        }}
                        value={selectedCourse}
                    >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        value={selectedBranch}
                        disabled={!selectedCourse}
                    >
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        value={selectedExamType}
                    >
                        <option value="">All Exam Types</option>
                        {examTypes.map((examType) => (
                            <option key={examType} value={examType}>
                                {examType}
                            </option>
                        ))}
                    </select>
                </div>

                {currentPapers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentPapers.map((paper, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md"
                            >
                                <h2 className="text-xl font-bold mb-2">
                                    {paper.subjectName}
                                </h2>
                                <p className="mb-2">
                                    Subject Code: {paper.subjectCode}
                                </p>
                                <p className="mb-2">
                                    Semester: {paper.semester}
                                </p>
                                <p className="mb-2">Year: {paper.year}</p>
                                <p className="mb-2">
                                    Exam Type: {paper.examType}
                                </p>
                                <p className="mb-2">Course : {paper.course}</p>
                                <p className="mb-2">
                                    Branch:{' '}
                                    {Array.isArray(paper.branch)
                                        ? paper.branch.join(', ')
                                        : paper.branch}
                                </p>
                                <a
                                    href={paper.link}
                                    className="text-blue-500 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View PDF
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        <br />
                        <div className="text-center p-4 bg-white rounded-lg shadow-md">
                            <p className="text-xl font-semibold text-gray-700">
                                No papers found matching the criteria. Try
                                adjusting your filters.
                                <br /> If You have any PYQ paper, Please Provide
                                us{' '}
                                <a
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                                    className="text-blue-500"
                                    target="_blank"
                                >
                                    Click
                                </a>
                            </p>
                        </div>
                    </>
                )}

                <div className="flex justify-center mt-6 ">
                    <ul className="flex flex-wrap justify-center">
                        {[...Array(totalPages).keys()].map((number) => (
                            <li
                                key={number + 1}
                                className={`px-3 py-1 m-1 border rounded-md cursor-pointer ${
                                    currentPage === number + 1
                                        ? 'bg-sky-500 text-white'
                                        : 'bg-white text-gray-700'
                                }`}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
                <p className="mb-4">
                    Get solved questions for just ₹29. <br />
                    <a className="text-sm text-gray-500">
                        Terms and conditions apply.
                    </a>
                </p>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                    className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                    Buy Solved Question Paper
                </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="mb-4">
                    If you have any PYQs or notes, please share them with us.
                </p>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                    className="inline-block px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover transition-colors duration-200"
                    target="_blank"
                >
                    Click Here To Share PYQs
                </a>
            </div>
            <Footer />
        </div>
    );
};

export default PYQPage;
