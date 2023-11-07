import services.aprs_client as aprs
import os


def main():
    os.system("cls")
    aprsc = aprs.Aprs_client()
    aprsc.connect()
    aprsc.receive(debug=False, parse=False)


if __name__ == "__main__":
    main()
