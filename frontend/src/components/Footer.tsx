import GrantsLogo from "public/img/grants-logo.svg";
import { ExternalRoutes } from "src/constants/routes";
import { UswdsIconNames } from "src/types/generalTypes";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Address,
  Grid,
  GridContainer,
  SocialLinks,
  Footer as USWDSFooter,
} from "@trussworks/react-uswds";

import { USWDSIcon } from "src/components/USWDSIcon";

// Recreate @trussworks/react-uswds SocialLink component to accept any Icon
// https://github.com/trussworks/react-uswds/blob/cf5b4555e25f0e52fc8af66afe29253922bed2a5/src/components/Footer/SocialLinks/SocialLinks.tsx#L33
type SocialLinkProps = {
  href: string;
  name: string;
  icon: string;
};

const SocialLink = ({ href, name, icon }: SocialLinkProps) => (
  <a className="usa-social-link" href={href} title={name} target="_blank">
    <USWDSIcon
      className="usa-social-link__icon"
      height="40px"
      name={icon as UswdsIconNames}
      aria-label={name}
    />
  </a>
);

const Footer = () => {
  const t = useTranslations("Footer");

  const links = [
    {
      href: ExternalRoutes.GRANTS_X_TWITTER,
      name: t("linkXTwitter"),
      icon: "x",
    },
    {
      href: ExternalRoutes.GRANTS_YOUTUBE,
      name: t("linkYoutube"),
      icon: "youtube",
    },
    {
      href: ExternalRoutes.GRANTS_BLOG,
      name: t("linkBlog"),
      icon: "local_library",
    },
    {
      href: ExternalRoutes.GRANTS_NEWSLETTER,
      name: t("linkNewsletter"),
      icon: "mail",
    },
    {
      href: ExternalRoutes.GRANTS_RSS,
      name: t("linkRss"),
      icon: "rss_feed",
    },
    {
      href: ExternalRoutes.GITHUB_REPO,
      name: t("linkGithub"),
      icon: "github",
    },
  ].map(({ href, name, icon }) => (
    <SocialLink href={href} key={name} name={name} icon={icon} />
  ));

  return (
    <USWDSFooter
      data-testid="footer"
      size="medium"
      returnToTop={
        <GridContainer className="usa-footer__return-to-top margin-top-5">
          <a href="#">{t("returnToTop")}</a>
        </GridContainer>
      }
      primary={
        <GridContainer>
          <Grid row gap>
            <Grid tablet={{ col: 4 }}>
              <div className="footer-logo-container position-relative dekstop:height-5">
                <Image
                  className="height-auto position-relative"
                  alt={t("logoAlt")}
                  src={GrantsLogo as string}
                  unoptimized
                  fill
                />
              </div>
            </Grid>
            <Grid className="usa-footer__contact-links" tablet={{ col: 8 }}>
              <SocialLinks links={links} />
              <h2 className="usa-footer__contact-heading text-balance">
                {t("agencyContactCenter")}
              </h2>
              <Address
                size="medium"
                items={[
                  <a key="telephone" href={`tel:${t("telephone")}`}>
                    {t("telephone")}
                  </a>,
                  <a
                    key="email"
                    href={`mailto:${ExternalRoutes.EMAIL_SUPPORT}`}
                  >
                    {ExternalRoutes.EMAIL_SUPPORT}
                  </a>,
                ]}
              />
            </Grid>
          </Grid>
        </GridContainer>
      }
      secondary={null}
    />
  );
};

export default Footer;
