function SizeGuide() {
  return (
    <div className="page-container">
      <h1>Size Guide</h1>
      <p className="subtitle">Find your perfect fit with our size chart.</p>

      <div className="size-table-wrapper">
        <table className="size-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Bust (cm)</th>
              <th>Waist (cm)</th>
              <th>Hips (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>XS</td><td>82-86</td><td>64-68</td><td>88-92</td></tr>
            <tr><td>S</td><td>86-90</td><td>68-72</td><td>92-96</td></tr>
            <tr><td>M</td><td>90-94</td><td>72-76</td><td>96-100</td></tr>
            <tr><td>L</td><td>94-98</td><td>76-80</td><td>100-104</td></tr>
            <tr><td>XL</td><td>98-102</td><td>80-84</td><td>104-108</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default SizeGuide;