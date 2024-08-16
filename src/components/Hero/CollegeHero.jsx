import React from 'react';

const CollegeHero = ({ tagline, children }) => {
    return (
        <section className="bg-gradient-to-t from-sky-200 to bg-white text-center p-8 rounded-b-3xl">
            <h2 className="text-6xl font-bold my-10">Welcome to {tagline}</h2>
            {children}
        </section>
    );
};

export default CollegeHero;
