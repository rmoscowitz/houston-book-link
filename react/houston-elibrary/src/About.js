import React from 'react';
import houstonhack from './houstonhack.jpg';
import mountain from './mountain.svg';
import christian from './christian.png';
import cameron from './cameron.png';
import robyn from './robyn.png';
import dylan from './dylan.png';
import daniel from './daniel.png';
import eric from './eric.png';

class About extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
    	<div className="about-container">
	      	<h1>About</h1>
		    <div className="row media">
		    	<div className="col-sm-6 media-middle">
		    		<img className="media-object img-thumbnail" src={houstonhack} alt="Houston hackathon 2017 flyer" />
		    	</div>
		    	<div className="col-sm-6">
			    	<h2>Houston Hackathon 2017</h2>
			    	<p>This project was done as part of the 2017 Houston Hackathon,
			    	where teams spend a weekend building applications that help solve
			    	civic issues within the city of Houston.</p>
		    	</div>
		    </div>
		    <div className="row">
		    	<div className="col-sm-6">
			    	<h2>Mission</h2>
			    	<p>There are two main public libraries in Houston; the Houston Public Library and Harris 
			    	County Public Library. To search for digital books, people are currently forced to perform
			    	two separate searches, one at each of the library's sites. Our goal is to provide a platform
			    	that allows users to search for and check out digital books from both libraries. We are also 
			    	strictly adhering to web accessibility guidelines so that individuals with disabilities 
			    	can use our service and access the ebooks more easily.
			    	</p>
			    </div>
			    <div className="col-sm-6 media-middle">
		    		<img className="media-object" src={mountain} width="256" alt="mountain icon with flag"/>
		    	</div>
		    </div>
		    <div className="row row-media">
		    	<div className="col-sm-12">
		    		<h2>Team</h2>
		    		<p></p>
		    	</div>
		    	<div className="col-sm-2">
		    		<img className="media-object" src={cameron} width="128" alt="cameron" />
		    		<p>Cameron</p>
		    	</div>
		    	<div className="col-sm-2">
		    		<img className="media-object" src={robyn} width="128" alt="robyn" />
		    		<p>Robyn</p>
		    	</div>
		    	<div className="col-sm-2">
		    		<img className="media-object" src={daniel} width="128" alt="dan" />
		    		<p>Dan</p>
		    	</div>
		    	<div className="col-sm-2">
		    		<img className="media-object" src={dylan} width="128" alt="dylan" />
		    		<p>Dylan</p>
		    	</div>
		    	<div className="col-sm-2">
		    		<img className="media-object" src={christian} width="128" alt="christian" />
		    		<p>Christian</p>
		    	</div>
		    	<div className="col-sm-2">
		    		<img className="media-object" src={eric} width="128" alt="eric" />
		    		<p>Eric</p>
		    	</div>
		    </div>
	    </div>	
    );
  }
}

export default About;