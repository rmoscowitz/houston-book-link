import React from 'react';
import harrisCard from './harris-co-cards.png'
import houstonCard from './houston-card.png'

class FAQ extends React.Component {
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
    	<div className="resources-container">
	      	<h1>Resources</h1>
		    <div className="row media">
		    	<div className="col-sm-6 media-middle">
		    		<a href="http://houstonlibrary.org/library-card-registration">
		    			<img className="media-object" src={houstonCard} alt="Houston library card" />
		    		</a>
		    		<h5>Get your Houston library card!</h5>
		    	</div>
		    	<div className="col-sm-6 media-middle">
		    		<a href="http://www.hcpl.net/about/library-cards">
		    			<img className="media-object" src={harrisCard} alt="Harris County library card" />
		    		</a>
		    		<h5>Get your Houston library card!</h5>
		    	</div>
		    </div>
	    </div>	
    );
  }
}

export default FAQ;