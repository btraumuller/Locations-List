<template>
	<div class="location-listing">
		<div class="location-card" v-for="location in locations">
			<div class="location-card__content">
                <div class="location-card__photo">
                    <a class="location-card__image-link" :href="location.locationUrl">
                        <img :src="location.image" />
                    </a>
                    <div class="location-card__buttons-tablet" v-if="location.buttons !== ''">
                        <a v-for="button in location.buttons" :class="button.cssClass" :href="button.url">{{button.text}}</a>
                    </div>
                </div>
				<div class="location-card__main-content">
                    <div class="location-card__info">
                        <h3 class="location-card__name">
                            <a class="location-card__name-link" :href="location.locationUrl" v-html="location.name"></a>
                        </h3>
                        <a class="location-card__view-details" :href="location.locationUrl">{{viewLocationDetailsLabel}}</a>
                    </div>
					<div class="location-card__details">
						<div class="location-card__left-column">
                            <div class="location-card__address">

                                <h4 class="location-card__address-title"><span class="fa fa-map-marker"></span>{{addressLabel}}</h4>

                                <div class="location-card__address-text" v-html="location.address"></div>

                                <a class="location-card__get-directions" target="_blank" :href="location.getDirectionsUrl" v-html="getDirectionsLabel"></a>
                                <div class="location-card__locations-within-container" v-if="location.viewLocationsWithinUrl">
                                    <a class="location-card__locations-within" :href="location.viewLocationsWithinUrl">{{viewLocationsWithinLabel}}</a>
                                </div>
                                
                            </div>
                            <div class="location-card__phone">

                                <h4 class="location-card__phone-title">
                                    <span class="fa-phone"></span>
                                    <span v-if="location.showSeeAllPhoneNumber == false">{{officePhoneLabel}}</span>
                                    <span v-else>{{alternatePhoneLabel}}</span>
                                </h4>
                                <div class="location-card__phone-container">
                                    <a v-if="location.showSeeAllPhoneNumber == false" class="location-card__phone-number" :href="`tel:${location.phone}`">{{location.phone}}</a>
                                    <a v-else class="location-card__show-all-phone-numbers" :href="`${location.locationUrl}#phonesection`">{{seeAllNumbersLabel}}</a>
                                </div>
                            </div>
						</div>
						<div class="location-card__middle-column">
                            <div class="location-card__services">

                                <h4 class="location-card__services-title"><span class="fa-clipboard"></span> {{servicesLabel}}</h4>

                                <div class="location-card__services-container">
                                    <ul>
                                        <li class="location-card__service" v-for="service in location.services">{{service.name}}</li>
                                    </ul>
                                </div>
                                <a v-if="location.showAllServicesLink == true" class="location-card__show-all-service-link" :href="`${location.locationUrl}#servicessection`">{{seeAllServicesLabel}}</a>
                            </div>
						</div>
						<div class="location-card__right-column" :class="location.buttons.length === 0 ? 'no-buttons' : ''">
							<a v-for="button in location.buttons" :class="button.cssClass" :href="button.url">{{button.text}}</a>
						</div>
					</div>
				</div>
			</div>
            <div class="location-card__view-detail-mobile">
                <a class="location-card__view-details" :href="location.locationUrl">{{viewLocationDetailsLabel}}</a>
            </div>
		</div>
		<div class="location-card__show-more-btn">
			<button type="button" class="cta-button" v-if="hasMore" @click="getLocations">
				<span class="fa-angle-double-down left-icon"></span>
				{{showMoreResultsLabel}}
				<span class="fa-angle-double-down right-icon"></span>
			</button>
		</div>
	</div> 
</template>
<script>
	export default {
		name: 'locationListing',
		data() {
			return {
				locations: [],
				results: [], 
				hasMore: '',
				loadCount: 0,
				initialLoad: true,
				hasMore: '',
				showMoreResultsLabel: '',
				addressLabel: '', 
                servicesLabel: '',
                phoneLabel: '',
                getDirectionsLabel:'',
				viewLocationDetailsLabel: '',
				officePhoneLabel: '', 
                viewLocationDetailsLabel: '',
                viewLocationsWithinLabel: '',
                seeAllNumbersLabel: '',
                seeAllServicesLabel: '',
                alternatePhoneLabel:''
			}
	    },
	    methods: {
		    getLocations: function () {

			    let startCount = this.loadCount;
			    let cardsLoaded; 
                let searchFilter = window.location.search;
                let searchApi;

				if (window.outerWidth < 1025) {
					cardsLoaded = 5;
				} else {
					cardsLoaded = 10;
                }

                if (searchFilter !== '') {
                    searchApi = '/mapi/public/LocationSearch.json' + searchFilter + '&label=d6731d49dfcb4082bb267e7b62940469&start=' + startCount + '&count=' + cardsLoaded;
                } else {
                    searchApi = '/mapi/public/LocationSearch.json?label=d6731d49dfcb4082bb267e7b62940469&start=' + startCount + '&count=' + cardsLoaded;
                }
                console.log(searchApi);
                
                this.$http.get(searchApi).then(response => {
						
					this.hasMore = response.data.response.hasMore;
                    this.results = response.data.response;
                    this.phoneLabel = response.data.response.labels.officePhoneLabel
					this.addressLabel = response.data.response.labels.addressLabel;							
					this.showMoreResultsLabel = response.data.response.labels.showMoreResultsLabel;
					this.servicesLabel = response.data.response.labels.servicesLabel;
					this.viewLocationDetailsLabel = response.data.response.labels.viewLocationDetailsLabel; 
                    this.officePhoneLabel = response.data.response.labels.officePhoneLabel;
                    this.alternatePhoneLabel = response.data.response.labels.alternatePhoneLabel
                    this.getDirectionsLabel = response.data.response.labels.linkLocationMapLabel;
                    this.viewLocationDetailsLabel = response.data.response.labels.viewLocationDetailsLabel;
                    this.viewLocationsWithinLabel = response.data.response.labels.viewLocationsWithinLabel
                    this.seeAllNumbersLabel = response.data.response.labels.seeAllNumbersLabel;
                    this.seeAllServicesLabel = response.data.response.labels.seeAllServicesLabel
                    let locationResults = response.data.response.locations;

					for (let location in locationResults) {
                        this.locations.push(locationResults[location]);
                        this.loadCount++;
					}
						
				});
			}
        },

		created: function () {
			this.getLocations();
        }
        
    }
</script>